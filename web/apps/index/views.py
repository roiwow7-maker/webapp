from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from apps.shop.models import Order,ProductVariant,RecyclingRequest
from .models import Brand, Category, Product
from .serializers import (
    BrandSerializer,
    CategorySerializer,
    ProductSerializer,
)


class ManagementReportViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        data = {
            "total_products": ProductVariant.objects.count(),
            "total_stock": ProductVariant.objects.aggregate(total=Sum("stock"))["total"] or 0,
            "orders_count": Order.objects.count(),
            "total_income": Order.objects.aggregate(total=Sum("total_clp"))["total"] or 0,
            "recycling_requests": RecyclingRequest.objects.count(),
        }
        return Response(data)

class ReadOnlyOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        # GET / HEAD / OPTIONS → cualquiera
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        # POST / PUT / DELETE → solo staff
        return request.user and request.user.is_staff


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["name"]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [ReadOnlyOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["name", "slug"]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = (
        Product.objects.filter(publish=True)
        .select_related("brand", "category")
        .prefetch_related("variants", "images", "models3d")
    )
    serializer_class = ProductSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["brand", "category", "condition", "grade"]
    search_fields = ["title", "sku_root", "short_desc", "long_desc"]
    ordering_fields = ["created_at", "title"]

