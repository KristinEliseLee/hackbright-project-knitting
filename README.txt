This webap lets you make knit patterns (written as if in the round)

It shows what they will look like using SVGs, then allows naming, saving, searching, and liking other patterns.


Steps to use:

    create a secrets.sh file that says

        export FLASK_KEY='{flask key here}'

    create a psql db called "knitpreviewproject"

    in the console:

        virtualenv env
        source env/bin/activate
        source secrets.sh
        pip install -r requirements.txt
        python3 server.py

to run unit tests:

    create a psql db called "knitpreviewtest"

    in the console:
        python flask_db_unittests.py

    to run with coverage:
        in console:
            coverage run --source=. --omit="env/*","winenv/*","tests_selenium.py" flask_db_unittests.py
            coverage html
        
        open htmlcov/index.html

to run selenium tests:

    install geckodriver & firefox
    have the server running

    in the console:
        python tests_selenium.py

