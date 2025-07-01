from flask import Flask, render_template, request, redirect, url_for, flash, session
from functools import wraps
from datetime import datetime

app = Flask(__name__)
app.secret_key = "super-secret-key"

# Пример базы данных (можно заменить на SQLite или другую позже)
admin_users = {
    "admin": {
        "password": "coffee123",
        "first_name": "Админ"
    }
}

# Пример пользователей
users_db = [
    {
        "first_name": "Иван",
        "last_name": "Иванов",
        "username": "ivan123",
        "phone_number": "+79991112233",
        "gender": "мужской",
        "age": 25,
        "role": "user",
        "registration_date": "2023-10-10"
    },
    {
        "first_name": "Анна",
        "last_name": "Петрова",
        "username": "anna_p",
        "phone_number": "+79994445566",
        "gender": "женский",
        "age": 28,
        "role": "admin",
        "registration_date": "2023-09-05"
    }
]

@app.route("/")
def index():
    if session.get("admin_logged_in"):
        return redirect(url_for("admin_panel"))
    return redirect(url_for("login"))


# Авторизация
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = admin_users.get(username)
        if user and user["password"] == password:
            session["admin_logged_in"] = True
            session["admin_username"] = username
            return redirect(url_for("admin_panel"))
        else:
            flash("Неверный логин или пароль", "danger")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    flash("Вы вышли из системы", "info")
    return redirect(url_for("login"))

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("admin_logged_in"):
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function

@app.route("/admin/panel")
@login_required
def admin_panel():
    user = admin_users[session["admin_username"]]
    return render_template("admin.html", admin_user=user)

@app.route("/admin/users")
@login_required
def admin_users_page():  # <-- новое имя функции
    user = admin_users[session["admin_username"]]
    search_query = request.args.get("search", "")
    filtered_users = [u for u in users_db if search_query.lower() in (u.get("first_name", "") + u.get("phone_number", "")).lower()]
    return render_template("users.html", users=filtered_users, admin_user=user, uid=1, search=search_query)

@app.route("/admin/settings")
@login_required
def admin_settings():
    user = admin_users[session["admin_username"]]
    return render_template("settings.html", admin_user=user, uid=1)

@app.route("/admin/broadcast")
@login_required
def admin_broadcast():
    user = admin_users[session["admin_username"]]
    return render_template("broadcast.html", admin_user=user, uid=1)

if __name__ == "__main__":
    app.run(debug=True)
