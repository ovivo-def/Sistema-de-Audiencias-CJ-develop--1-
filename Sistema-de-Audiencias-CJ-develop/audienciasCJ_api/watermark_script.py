
import os
import cv2
# Definir la ruta de entrada y salida del video
input_video_path = "C:/Users/usuario/Documents/python/test.wmv"  # Cambia la ruta según sea necesario
output_video_path = "C:/Users/usuario/Documents/python/Salida"

# Obtener la extensión del archivo
file_extension = os.path.splitext(input_video_path)[1].lower()

# Abrir el video
cap = cv2.VideoCapture(input_video_path)

# Obtener las propiedades del video
fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Definir el codec y la extensión de salida según el tipo de video
if file_extension == '.mp4':
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec para MP4
    output_video_path += '.mp4'  # Salida con extensión .mp4
elif file_extension == '.wmv':
    fourcc = cv2.VideoWriter_fourcc(*'wmv2')  # Codec para WMV
    output_video_path += '.wmv'  # Salida con extensión .wmv
else:
    raise ValueError("Formato de video no soportado. Usa .mp4 o .wmv")

# Crear el objeto VideoWriter
out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))

# Definir el texto y sus propiedades
text = "Juan Perez"
font = cv2.FONT_HERSHEY_SIMPLEX
font_scale = 1
font_color = (255, 255, 255)  # Blanco
thickness = 2
position = (10, 30)  # (x, y)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Agregar el texto al frame
    cv2.putText(frame, text, position, font, font_scale, font_color, thickness)

    # Escribir el frame en el archivo de salida
    out.write(frame)

# Liberar los objetos
cap.release()
out.release()

print("El video ha sido procesado y guardado en:", output_video_path)
