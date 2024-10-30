LOGGING_CONFIG = { 
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': { 
        'standard': { 
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s',
            "datefmt": "%d %b %y %H:%M:%S"
        },
            'detailed': { 
            'format': '%(asctime)s - %(levelname)s [%(filename)s:%(lineno)d] %(name)s: %(message)s',
            "datefmt": "%d %b %y %H:%M:%S"
        },
    },
    'handlers': { 
        'default': { 
            'level': 'DEBUG',
            'formatter': 'standard',
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout',  # Default is stderr
        },
        'file': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'formatter': 'detailed',
                'filename': "log.txt"
                # 'maxBytes': 1024,
                # 'backupCount': 3
            },
         'nab': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'formatter': 'detailed',
                'filename': "nab.txt"
                # 'maxBytes': 1024,
                # 'backupCount': 3
            },
         'database': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'formatter': 'detailed',
                'filename': "database.txt"
                # 'maxBytes': 1024,
                # 'backupCount': 3
            },
            'httpx': {
                'level': 'DEBUG',
                'class': 'logging.FileHandler',
                'formatter': 'detailed',
                'filename': "httpx.txt"
            },
            # 'syslog': {
            #     'level': 'DEBUG',
            #     'class': 'logging.handlers.SysLogHandler',
            #     # 'address': ('localhost', 514),
            #     'formatter': 'detailed',
            # }
    },
    'loggers': { 
        '': {  # root logger
            'handlers': ['default', 'file'],
            'level': 'DEBUG',
            'propagate': False
        },
        'my.packg': { 
            'handlers': ['default'],
            'level': 'DEBUG',
            'propagate': False
        },
        'nab': { 
            'handlers': ['nab'],
            'level': 'DEBUG',
            'propagate': False
        },
        'database': { 
            'handlers': ['database'],
            'level': 'DEBUG',
            'propagate': False
        },
        'httpx': {
            'handlers': ['httpx'],
            'level': 'DEBUG',
             'propagate': False
        },
        'httpcore': {
            'handlers': ['default'],
            'level': 'INFO', #most logs are DEBUG
        },
        'sqlalchemy.engine': { 
            'handlers': ['database'],
            'level': 'DEBUG',
            'propagate': False
        },
        '__main__': {  # if __name__ == '__main__'
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': False
        },
    } 
}