import Robot
from socketIO_client import SocketIO
import queue

class address:
    def __init__(self, x = None, y = None):
        self.x = x
        self.y = y

#setup
host = "192.168.137.1"
port = 2000
socketIO = SocketIO(host, port)
index = None
lastState = 'stop'
state = 'stop'
times = 0
cmdQ = queue.Queue(maxsize = 5) 
id = 1
nowAddress = address()
lastAddress = address()
robot = Robot.Robot()
