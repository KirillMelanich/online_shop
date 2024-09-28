from django.shortcuts import render
from goods_list import goods


def catalog(request):
    context = {
        "title": "Home - Catalog",
        'goods': goods
    }
    return render(request, "goods/catalog.html", context=context)


def product(request):
    return render(request, "goods/product.html")
