from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem, RecyclingRequest



@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "session_key", "created_at")
    search_fields = ("session_key", "user__username")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("cart", "variant", "quantity")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "title_snapshot", "price_clp", "quantity")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_clp", "status", "payment_method", "created_at")
    list_filter = ("status", "payment_method")
    inlines = [OrderItemInline]
@admin.register(RecyclingRequest)
class RecyclingRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre", "email", "tipo_equipo", "created_at")
    search_fields = ("nombre", "email", "tipo_equipo")
    list_filter = ("created_at",)