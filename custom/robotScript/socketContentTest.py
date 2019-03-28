#reference:https://pypi.org/project/socketIO-client/
from socketIO_client import SocketIO

HOST = '140.137.132.139'
PORT = 2000

def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_reconnect():
    print('reconnect')
    
#deal with event
def on_date_response(*args):
    print('date:', args[0]['data'])

socketIO = SocketIO(HOST, PORT)
socketIO.on('connect', on_connect)
socketIO.on('disconnect', on_disconnect)
socketIO.on('reconnect', on_reconnect)


socketIO.on('test', on_date_response)
socketIO.wait(seconds=1)
socketIO.emit('client_data', {'letter': 'test'})
socketIO.disconnect()


print('done')
