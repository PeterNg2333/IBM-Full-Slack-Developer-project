# Postgre SQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

INSTALLED_APPS = (
    'orm', ## Step 1: crerate object relational mapping (ORM) 
    'standalone', ## Step 2: create standalone application
)

SECRET_KEY = 'SECRET KEY for this Django Project'
