import socket
import threading
from emotion_detection import classify_emotions

def send_emotion_label(conn, addr):
    print(f"Processing emotion request from {addr}")
    label = None
    while not label:
        label = classify_emotions()
 
    conn.sendall(label.encode())
    
    conn.close()

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('localhost', 50000))
    server_socket.listen(1)
    print("Server started, waiting for connection...")
    while True:
        conn, addr = server_socket.accept()
        received = conn.recv(1024)
        if received.decode() == "EmotionRequest":
            client_thread = threading.Thread(target=send_emotion_label, args=(conn, addr))
            client_thread.start()

if __name__ == "__main__":
    start_server()
