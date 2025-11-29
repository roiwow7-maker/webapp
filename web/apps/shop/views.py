from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem, RecyclingRequest
from .serializers import OrderSerializer, RecyclingRequestSerializer
from apps.index.models import ProductVariant
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from django.db.models.functions import TruncDate
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
# ---------------------------------------
#    FUNCIÓN COMÚN PARA SESSION_KEY
# ---------------------------------------
def get_session_key_from_request(request):
    """
    Obtiene la session_key desde:
      1) Header X-Session  -> usado por tu frontend real
      2) Query param ?session_key=... -> para debug en el navegador / DRF
      3) 'anon' como último recurso
    """
    # 1) Frontend: header X-Session
    header_key = request.headers.get("X-Session", "").strip()
    if header_key:
        return header_key

    # 2) Debug: ?session_key=<uuid>
    query_key = request.query_params.get("session_key", "").strip()
    if query_key:
        return query_key

    # 3) Fallback
    return "anon"


# ---------------------------------------
#              CARRITO
# ---------------------------------------
@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class CartView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Devuelve el carrito actual de la sesión.
        IMPORTANTe: tomamos TODOS los CartItem cuyo Cart tenga este session_key.
        """
        session = get_session_key_from_request(request)
        print("DEBUG Cart GET -> session:", session)

        # Cart base (aunque haya otros duplicados en la BD)
        cart, _ = Cart.objects.get_or_create(session_key=session)

        # ⬇️ USAMOS cart__session_key, NO cart=cart, por si hay carritos duplicados
        items_qs = CartItem.objects.filter(
            cart__session_key=session
        ).select_related("variant", "variant__product")

        total = 0
        items_data = []

        for item in items_qs:
            price = getattr(item.variant, "price_clp", 0)
            subtotal = price * item.quantity
            total += subtotal

            items_data.append(
                {
                    "id": item.id,
                    "variant": {
                        "id": item.variant.id,
                        "sku": item.variant.sku,
                        "price_clp": price,
                        "product_id": item.variant.product_id,
                        "title": item.variant.product.title,
                    },
                    "quantity": item.quantity,
                    "subtotal": subtotal,
                }
            )

        data = {
            "id": cart.id,          # uno de los carts de la sesión
            "session_key": session,
            "items": items_data,
            "total_clp": total,
        }

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        """Agrega una variante al carrito."""
        session = get_session_key_from_request(request)

        cart, _ = Cart.objects.get_or_create(session_key=session)

        variant_id = request.data.get("variant_id")
        quantity = int(request.data.get("quantity", 1) or 1)

        if not variant_id:
            return Response(
                {"error": "Falta variant_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        print(
            "DEBUG Cart POST -> session:",
            session,
            "variant_id:",
            variant_id,
            "qty:",
            quantity,
        )

        variant = get_object_or_404(ProductVariant, id=variant_id)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            defaults={"quantity": quantity},
        )

        if not created:
            item.quantity += quantity
            item.save()

        return Response({"success": True}, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class CartClearView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Vacía el carrito completo de la sesión:
        borra TODOS los CartItem cuyo Cart tenga este session_key.
        """
        session = get_session_key_from_request(request)

        deleted, _ = CartItem.objects.filter(
            cart__session_key=session
        ).delete()

        print(f"DEBUG Cart CLEAR -> session: {session}, deleted: {deleted}")

        return Response({"cleared": deleted}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class CartRemoveItemView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Quita un item específico del carrito (por variant_id) en TODA la sesión.
        """
        session = get_session_key_from_request(request)

        variant_id = request.data.get("variant_id")
        if not variant_id:
            return Response(
                {"error": "Falta variant_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qs = CartItem.objects.filter(
            cart__session_key=session,
            variant_id=variant_id,
        )
        deleted = qs.count()
        qs.delete()

        print(
            f"DEBUG Cart REMOVE -> session: {session}, variant_id: {variant_id}, deleted: {deleted}"
        )

        return Response({"removed": deleted}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class CartUpdateQuantityView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Actualiza la cantidad de un variant_id en el carrito de esta sesión.
        Si quantity <= 0 → borra el item.
        """
        session = get_session_key_from_request(request)

        variant_id = request.data.get("variant_id")
        quantity_raw = request.data.get("quantity", 1)

        if not variant_id:
            return Response(
                {"error": "Falta variant_id"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity_raw)
        except (TypeError, ValueError):
            return Response(
                {"error": "quantity debe ser entero"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart, _ = Cart.objects.get_or_create(session_key=session)
        variant = get_object_or_404(ProductVariant, id=variant_id)

        # ⬇️ De nuevo, filtramos por session, no sólo por cart
        item = CartItem.objects.filter(
            cart__session_key=session,
            variant=variant,
        ).first()

        if quantity <= 0:
            if item:
                item.delete()
            print(
                f"DEBUG Cart UPDATE -> session: {session}, variant_id: {variant_id}, removed"
            )
            return Response({"removed": True}, status=status.HTTP_200_OK)

        if not item:
            item = CartItem.objects.create(
                cart=cart,
                variant=variant,
                quantity=quantity,
            )
        else:
            item.quantity = quantity
            item.save()

        print(
            f"DEBUG Cart UPDATE -> session: {session}, variant_id: {variant_id}, quantity: {quantity}"
        )

        return Response(
            {
                "updated": True,
                "variant_id": item.variant_id,
                "quantity": item.quantity,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class CheckoutView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Crea una orden a partir de TODOS los CartItem que comparten session_key.
        """
        session = get_session_key_from_request(request)

        cart, _ = Cart.objects.get_or_create(session_key=session)

        items_qs = CartItem.objects.filter(
            cart__session_key=session
        ).select_related("variant", "variant__product")

        if not items_qs.exists():
            return Response(
                {"error": "Carrito vacío"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        customer_name = request.data.get("customer_name", "").strip()
        customer_email = request.data.get("customer_email", "").strip()
        customer_phone = request.data.get("customer_phone", "").strip()
        customer_address = request.data.get("customer_address", "").strip()
        customer_notes = request.data.get("customer_notes", "").strip()
        payment_method = request.data.get("payment_method", "MANUAL")

        if not customer_name or not customer_email:
            return Response(
                {"error": "Nombre y correo son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total = 0
        prepared_items = []
        for item in items_qs:
            price = getattr(item.variant, "price_clp", 0)
            subtotal = price * item.quantity
            total += subtotal
            prepared_items.append((item, price))

        order = Order.objects.create(
            user=cart.user,
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            customer_address=customer_address,
            customer_notes=customer_notes,
            total_clp=total,
            status=Order.Status.PENDING,
            payment_method=payment_method,
            payment_reference="",
        )

        for cart_item, price in prepared_items:
            OrderItem.objects.create(
                order=order,
                variant=cart_item.variant,
                title_snapshot=cart_item.variant.product.title,
                price_clp=price,
                quantity=cart_item.quantity,
            )

        CartItem.objects.filter(cart__session_key=session).delete()

        data = {
            "order_id": order.id,
            "total_clp": order.total_clp,
            "status": order.status,
        }

        print(
            f"DEBUG CHECKOUT -> session: {session}, order_id: {order.id}, total: {order.total_clp}"
        )

        return Response(data, status=status.HTTP_201_CREATED)

@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class OrderListView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=200)



@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class RecyclingRequestView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = RecyclingRequest.objects.all().order_by("-created_at")
        serializer = RecyclingRequestSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RecyclingRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@method_decorator(csrf_exempt, name="dispatch")
@method_decorator(csrf_exempt, name="dispatch")
class MyOrdersView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Order.objects.filter(user=request.user).order_by("-created_at")
        serializer = OrderSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name="dispatch")
class AdminStatsView(views.APIView):
    """
    Devuelve estadísticas de órdenes y carritos agrupadas por día.
    Solo para usuarios administrativos (is_staff=True).
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        # días hacia atrás, por defecto 30
        try:
            days = int(request.GET.get("days", 30))
        except ValueError:
            days = 30

        since = timezone.now() - timedelta(days=days)

        # Órdenes por día
        orders_qs = (
            Order.objects.filter(created_at__gte=since)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(
                orders_count=Count("id"),
                total_clp=Sum("total_clp"),
            )
            .order_by("day")
        )

        # Ítems vendidos por día (sumando cantidades)
        items_qs = (
            OrderItem.objects.filter(order__created_at__gte=since)
            .annotate(day=TruncDate("order__created_at"))
            .values("day")
            .annotate(
                items_sold=Sum("quantity"),
            )
            .order_by("day")
        )

        # Carritos por día (cantidad de carritos que tuvieron ítems)
        carts_qs = (
            Cart.objects.filter(created_at__gte=since)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(
                carts_count=Count("id"),
            )
            .order_by("day")
        )

        # Combinar todo en un diccionario por día
        stats_by_day = {}

        # Órdenes
        for row in orders_qs:
            day_str = row["day"].isoformat()
            stats_by_day.setdefault(day_str, {
                "date": day_str,
                "orders_count": 0,
                "total_clp": 0,
                "carts_count": 0,
                "items_sold": 0,
            })
            stats_by_day[day_str]["orders_count"] = row["orders_count"]
            stats_by_day[day_str]["total_clp"] = row["total_clp"] or 0

        # Ítems vendidos
        for row in items_qs:
            day_str = row["day"].isoformat()
            stats_by_day.setdefault(day_str, {
                "date": day_str,
                "orders_count": 0,
                "total_clp": 0,
                "carts_count": 0,
                "items_sold": 0,
            })
            stats_by_day[day_str]["items_sold"] = row["items_sold"] or 0

        # Carritos
        for row in carts_qs:
            day_str = row["day"].isoformat()
            stats_by_day.setdefault(day_str, {
                "date": day_str,
                "orders_count": 0,
                "total_clp": 0,
                "carts_count": 0,
                "items_sold": 0,
            })
            stats_by_day[day_str]["carts_count"] = row["carts_count"]

        # Pasar a lista ordenada por fecha
        stats_list = sorted(stats_by_day.values(), key=lambda x: x["date"])

        return Response(
            {
                "days": days,
                "results": stats_list,
            },
            status=status.HTTP_200_OK,
        )