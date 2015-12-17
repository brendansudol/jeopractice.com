from django.views.defaults import page_not_found, server_error


def handler404(request):
    return page_not_found(request, template_name='web/errors/404.html')


def handler500(request):
    return server_error(request, template_name='web/errors/500.html')
