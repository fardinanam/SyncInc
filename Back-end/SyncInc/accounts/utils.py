from django.conf import settings
from django.core.mail import send_mail

front_end_url = 'https://syncinc.netlify.app'
verify_email_url = 'https://syncinc-backend.onrender.com/accounts/verify-email'

def send_email_token(email, subject, message):
    try:
        
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]
        send_mail(subject, message, email_from, recipient_list)
    except Exception as e:
        print(e)
        return False
    
    return True

def send_verification_email(email, token):
    subject = 'SyncInc. Email Verification'
    message = f'Hi, \n\nPlease click on the link below to verify your email address. \n\n{verify_email_url}/{token} \n\nThanks, \nSyncInc.'
    send_email_token(email, subject, message)

def send_reset_password_email(username, email, token):
    subject = 'SyncInc. Reset Password'
    message = f'Hi, \n\nPlease click on the link below to reset your password.\n\nhttp://{front_end_url}/reset-password/{username}/{token} \n\nThanks, \nSyncInc.'
    send_email_token(email, subject, message)

