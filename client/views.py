from django.shortcuts import render_to_response

def app(request):
    return render_to_response('client/app.html')