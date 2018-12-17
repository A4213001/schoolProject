import Attributes
#####Robot to Server#####
att = Attributes
def start():
    print("send start")
    att.socketIO.emit('start', {'id': att.id,\
                                'x': att.nowAddress.x,\
                                'y': att.nowAddress.y})

def address():
    print("send address")
    att.socketIO.emit('address', {'index': att.index,\
                                  'now': {'x': att.nowAddress.x,\
                                          'y': att.nowAddress.y},\
                                  'last': {'x': att.lastAddress.x,\
                                           'y': att.lastAddress.y}})

def state():
    print("send state")
    att.socketIO.emit('state', {'index': att.index,\
                                'state': att.state})

#####Server to Robot#####
def on_connect():
    print('connect')

def on_disconnect():
    print('disconnect')

def on_reconnect():
    print('reconnect')

def on_index(*args):
    print('receive index')
    att.index = args[0]['index']

def on_cmd(*args):
    print('receive cmd:' , args[0])
    att.cmdQ.put(args[0])

def on_getState(*args):
    print('receive getState')
    State()