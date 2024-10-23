from django.db import models

from goods.models import Products
from users.models import User


class CartQueryset(models.QuerySet):
    def total_price(self):
        return sum(cart.products_price() for cart in self)

    def total_quantity(self):
        if self:
            return sum(cart.quantity for cart in self)
        return 0


class Cart(models.Model):
    user = models.ForeignKey(
        to=User, on_delete=models.CASCADE, null=True, blank=True, verbose_name="User"
    )
    product = models.ForeignKey(
        to=Products, on_delete=models.CASCADE, verbose_name="Product"
    )
    quantity = models.PositiveIntegerField(default=0, verbose_name="Quantity")
    session_key = models.CharField(max_length=32, blank=True, null=True)
    created_timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Created")

    class Meta:
        db_table = "cart"
        verbose_name = "Cart"
        ordering = ["-created_timestamp"]

    objects = CartQueryset().as_manager()

    def products_price(self):
        return round(self.product.sell_price() * self.quantity, 2)

    def __str__(self):
        if self.user:
            return (
                f"Cart: {self.user} | Product {self.product} | Quantity {self.quantity}"
            )
        return f"Anonymous cart | Product {self.product} | Quantity {self.quantity}"
