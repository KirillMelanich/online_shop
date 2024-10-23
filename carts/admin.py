from django.contrib import admin

from carts.models import Cart


class CartTabAdmin(admin.TabularInline):
    model = Cart
    fields = ["user", "product", "quantity", "created_timestamp"]
    search_fields = ["user__username", "product__name"]
    readonly_fields = ["created_timestamp"]
    extra = 1


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["user", "product", "quantity", "created_timestamp"]
    list_filter = ["user", "product", "created_timestamp"]
