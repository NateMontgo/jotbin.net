# jotbin.net

This website was built for hosting on an Ubuntu VPS running NGINX.

### [Live Demo](https://jotbin-net.vercel.app/)

## Overview

Jotbin was originally conceived to be a platform in which I would host web games that would be sold to various websites. Instead, Jotbin turned into a interactive timeline of my programming growth throughout high school.

I built this website at 14 years old. As my skills grew, so did the project. What started as a frontend-only website with two small games grew into a full stack web application with an NGINX and FastAPI powered backend. 

No generative AI was used to write any portion of the project's code. Some AI was used to fact check setup documentation.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, HTML5 Canvas
- **Backend**: Python, FastAPI
- **Current Deployment**: Vercel, Render
- **Original Deployment**: Ubuntu, NGINX, Gunicorn, Supervisor, Certbot

## Highlights

- Built, deployed, and maintained a Linux VPS.
- Developed an API with FastAPI.
- Created multiple browser games with responsive user interfaces without the use of any AI.

## Repository Structure

`etc` and `jotbin` represent folders that would exist at the root directory of a linux server.

`jotbin\frontend` contains all frontend elements of the website.

`jotbin\api` contains all APIs used in the project. Currently, only the Alphabet Race leaderboard API exists.

`docs` contains all supporting documentation. There is one document per website project and a readme. Each project document contains the learning objectives, the original developer commentary, and a modern day reflection.

## Setup

These setup instructions assume you have a live Ubuntu server ready for deployment.

1. Install NGINX.

    ```bash
    sudo apt install nginx
    ```

2. Install Supervisor for automated startup and log handling. 

    ```bash
    sudo apt install supervisor
    ```

3. Clone or copy the `etc` and `jotbin` folders to the root directory of your Ubuntu server.

4. Create a python virtual environment and install dependencies.

    ```bash
    sudo apt update
    sudo apt install -y nginx supervisor python3-venv

    cd /jotbin/api/alphabet-race
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

5. Create runtime and log directories.

    ```bash
    sudo mkdir -p /jotbin/api/alphabet-race/run
    sudo mkdir -p /jotbin/logs
    sudo touch /jotbin/logs/leaderboard-placeholder
    sudo chown -R www-data:www-data /jotbin/api/alphabet-race /jotbin/logs
    sudo chmod +x /jotbin/api/alphabet-race/gunicorn_start
    ```

6. In lines 21-22 of `jotbin\frontend\games\alphabet-race\js\main.js`, you will see the following commented code. Uncomment the code, add your domain to line 21, and delete line 23. This will properly configure Alphabet Race to use the API you are hosting on your server.

    ```javascript
    // const domain = "";
    // const api = location.protocol + "//" + domain + "/api/alphabet-race";
    ```

7. In lines 10-15 of `jotbin\api\alphabet-race\main.py`, you will find the following cors middleware. Replace the domain in line 12 with your domain or IP address. This will properly configure the Alphabet Race API to allow interfacing from your frontend.

    ```python
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://jotbin-net.vercel.app"],
        allow_methods=["GET","POST"],
        allow_headers=["content-type"]
    )
    ```

8. Create a symbolic link to enable the NGINX site.

    ```bash
    sudo ln -s /etc/nginx/sites-available/jotbin \
    /etc/nginx/sites-enabled/jotbin
    sudo rm -f /etc/nginx/sites-enabled/default
    ```

9. (Optional) Install and run Certbot to register an SSL certificate. Replace "your_domain.com" with your actual registered domain.

    ```bash
    sudo apt update
    sudo apt install certbot python3-certbot-nginx

    sudo certbot --nginx -d your_domain.com -d www.your_domain.com
    ```


10. Test and start both services.

    ```bash
    sudo nginx -t
    sudo systemctl enable --now supervisor
    sudo supervisorctl reread
    sudo supervisorctl update

    sudo systemctl enable --now nginx
    ```

11. View logs at `jotbin\logs`.
