from django.db import models
from django.conf import settings
from apps.index.models import ProductVariant
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

method_decorator(csrf_exempt, name='dispatch')
class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    session_key = models.CharField(max_length=64, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"Cart {self.id} (user: {self.user.username})"
        return f"Cart {self.id} (session: {self.session_key})"

method_decorator(csrf_exempt, name='dispatch')
class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.variant}"

method_decorator(csrf_exempt, name='dispatch')
class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendiente"
        PAID = "PAID", "Pagada"
        FAILED = "FAILED", "Fallida"
        CANCELED = "CANCELED", "Cancelada"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    customer_name = models.CharField(max_length=120, blank=True)
    customer_email = models.EmailField(blank=True)
    customer_phone = models.CharField(max_length=50, blank=True)
    customer_address = models.CharField(max_length=255, blank=True)
    customer_notes = models.TextField(blank=True)

    total_clp = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    payment_method = models.CharField(max_length=20, blank=True)  # MP / WEBPAY
    payment_reference = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} ({self.status})"

method_decorator(csrf_exempt, name='dispatch')
class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT)
    title_snapshot = models.CharField(max_length=200)
    price_clp = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.title_snapshot}"
method_decorator(csrf_exempt, name='dispatch')
class RecyclingRequest(models.Model):
    nombre = models.CharField(max_length=120)
    email = models.EmailField()
    tipo_equipo = models.CharField(max_length=255, blank=True)
    descripcion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reciclaje de {self.nombre} ({self.email}) - {self.created_at.date()}"
