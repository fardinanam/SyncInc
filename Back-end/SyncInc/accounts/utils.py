from django.conf import settings
from django.core.mail import send_mail

def send_email_token(email, token):
    try:
        subject = 'SyncInc. Email Verification'
        message = f'Hi, \n\nPlease click on the link below to verify your email address. \n\nhttp://127.0.0.1:8000/accounts/verify-email/{token} \n\nThanks, \nSyncInc.'
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]
        send_mail(subject, message, email_from, recipient_list)
    except Exception as e:
        print(e)
        return False
    
    return True
