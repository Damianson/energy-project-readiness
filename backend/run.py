import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() in ("1", "true", "yes")
    print(f"Starting Energy Project Readiness backend on port {port} (debug={debug})...")
    app.run(host="0.0.0.0", port=port, debug=debug)
