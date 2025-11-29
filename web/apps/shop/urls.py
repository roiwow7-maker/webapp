from django.urls import path
from .views import CartView, CheckoutView, CartClearView, CartRemoveItemView,CartUpdateQuantityView,OrderListView,RecyclingRequestView,MyOrdersView,AdminStatsView

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/update/", CartUpdateQuantityView.as_view(), name="cart_update"),
    path("cart/clear/", CartClearView.as_view(), name="cart-clear"),
    path("cart/remove/", CartRemoveItemView.as_view(), name="cart-remove"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("orders/", OrderListView.as_view(), name="orders"),
    path("recycling-requests/", RecyclingRequestView.as_view(), name="recycling_requests"),
    path("orders/mine/", MyOrdersView.as_view(), name="my-orders"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
]
