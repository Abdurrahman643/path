# Deployment Guide for Django Project on PythonAnywhere

This guide provides step-by-step instructions to deploy the Django project located in the `tmsp` directory on PythonAnywhere.

---

## 1. Prepare Django Project for Deployment

- Edit `tmsp/tmsp/settings.py`:

  - Set `DEBUG = False`

  - Set `ALLOWED_HOSTS` to include your PythonAnywhere domain, e.g.:

    ```python
    ALLOWED_HOSTS = ['yourusername.pythonanywhere.com']
    ```

  - Configure static files:

    ```python
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    ```

  - Ensure `SECRET_KEY` is set securely, preferably via environment variables.

  - Configure database settings if you plan to use PythonAnywhere's MySQL or keep SQLite.

- Collect static files:

  Run locally or on PythonAnywhere:

  ```
  python manage.py collectstatic
  ```

---

## 2. Upload Project to PythonAnywhere

- Use PythonAnywhere's file upload interface or clone your git repository:

  ```
  git clone https://github.com/yourusername/yourproject.git
  ```

---

## 3. Set Up Virtual Environment on PythonAnywhere

- Create a virtual environment:

  ```
  mkvirtualenv --python=python3.8 my-virtualenv
  ```

- Install dependencies:

  ```
  pip install -r requirements.txt
  ```

---

## 4. Configure Web App on PythonAnywhere

- Go to the Web tab and add a new web app.

- Choose manual configuration and select Python 3.8 or your version.

- Set the source code directory to your project directory.

- Set the virtualenv path.

- Edit the WSGI configuration file (`/var/www/yourusername_pythonanywhere_com_wsgi.py`) to point to your Django project:

  ```python
  import sys
  path = '/home/yourusername/path/to/tmsp'
  if path not in sys.path:
      sys.path.append(path)

  from tmsp.wsgi import application
  ```

- Configure static files mapping:

  - URL: `/static/`

  - Directory: `/home/yourusername/path/to/tmsp/staticfiles`

---

## 5. Run Migrations and Collectstatic on PythonAnywhere

- Open a Bash console on PythonAnywhere.

- Activate your virtualenv:

  ```
  workon my-virtualenv
  ```

- Run migrations:

  ```
  python manage.py migrate
  ```

- Collect static files:

  ```
  python manage.py collectstatic
  ```

---

## 6. Test Your Site

- Visit your PythonAnywhere domain to verify the site is running.

- Check error logs on PythonAnywhere for any issues.

---

## Additional Notes

- Set environment variables (e.g., `PAYSTACK_SECRET_KEY`) in the PythonAnywhere Web tab under "Environment Variables".

- For database changes, update your settings accordingly.

- For any issues, consult PythonAnywhere's help pages or contact support.

---

This completes the deployment setup for your Django project on PythonAnywhere.
