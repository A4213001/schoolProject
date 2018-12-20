import pigpio
import time

PWM_CONTROL_PIN = 18
PWM_FREQ = 50
STEP = 15

pi = pigpio.pi()

def angle_to_duty_cycle(angle=0):
    duty_cycle = int(500 * PWM_FREQ + (1900 * PWM_FREQ * angle / 180))
    return duty_cycle

try:
    print('按下 Ctrl-C 可停止程式')
    for angle in range(0, 181, STEP):
        dc = angle_to_duty_cycle(angle)
        print('角度={: >3}, 工作週期={: >6}'.format(angle, dc))
        pi.hardware_PWM(PWM_CONTROL_PIN, PWM_FREQ, dc)
        time.sleep(2)
    for angle in range(180, -1, -STEP):
        dc = angle_to_duty_cycle(angle)
        print('角度={: >3}, 工作週期={: >6}'.format(angle, dc))
        pi.hardware_PWM(PWM_CONTROL_PIN, PWM_FREQ, dc)
        time.sleep(2)
    pi.hardware_PWM(PWM_CONTROL_PIN, PWM_FREQ, angle_to_duty_cycle(90))
    while True:
        next
except KeyboardInterrupt:
    print('關閉程式')
finally:
    pi.set_mode(PWM_CONTROL_PIN, pigpio.INPUT)