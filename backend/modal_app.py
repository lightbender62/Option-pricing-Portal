from modal import App, Image, asgi_app

app = App("option-pricing-portal")

image = (
    Image.debian_slim()
    .apt_install("git")
    .pip_install_from_requirements("requirements.txt")
    .add_local_python_source("app")
)

@app.function(image=image)
@asgi_app()
def fastapi_app():
    from app.main import app
    return app