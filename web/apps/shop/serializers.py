from rest_framework import serializers
from .models import Order, OrderItem, RecyclingRequest

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "variant", "title_snapshot", "price_clp", "quantity"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "total_clp",
            "status",
            "payment_method",
            "payment_reference",
            "created_at",
            "items",
        ]
class RecyclingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecyclingRequest
        fields = ["id", "nombre", "email", "tipo_equipo", "descripcion", "created_at"]
