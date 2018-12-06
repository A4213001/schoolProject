import Attributes
import SocketEvent

att = Attributes

def listenSocket():
    att.socketIO.on('connect', SocketEvent.on_connect)
    att.socketIO.on('disconnect', SocketEvent.on_disconnect)
    att.socketIO.on('reconnect', SocketEvent.on_reconnect)
    att.socketIO.on('index', SocketEvent.on_index)
    att.socketIO.on('cmd', SocketEvent.on_cmd)
    att.socketIO.on('getState', SocketEvent.on_getState)
    att.socketIO.wait(seconds= 1)

robot = att.robot
def fixDrive():
    robot = att.robot

def doCmd(cmd = 'stop', times = 0):
    if(cmd == att.state):
        return
    att.lastState = att.state
    att.state = cmd
    att.times = times
    SocketEvent.state()
    
    if(cmd == 'go'):
        robot.wheels.go()
        
    elif(cmd == 'cw'):
        robot.wheels.cw()
        
    elif(cmd == 'ccw'):
        robot.wheels.ccw()
        
    elif(cmd == 'stop'):
        robot.wheels.stop()


testCmd ={'cmd': 'stop',\
          'times': 0}

def main():
    #setup
    SocketEvent.start()
    #loop    
    while True:
        listenSocket()
    
        #att.cmdQ.put(testCmd)
        if((not(att.cmdQ.empty())) and '''att.state=='stop'''):
            cmd = att.cmdQ.get()
            print(cmd)
            doCmd(cmd['cmd'], cmd['times'])
        
        #fixDrive()
            
    att.socketIO.disconnect()
       

if __name__ == '__main__':
    main()
