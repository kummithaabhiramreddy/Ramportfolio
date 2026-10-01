import imageio_ffmpeg
import subprocess
import os

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
input_file = "demo.mp4"
output_file = "compressed_demo.mp4"

print("Compressing demo.mp4...")
cmd = [
    ffmpeg_exe, "-y", "-i", input_file,
    "-vcodec", "libx264", "-crf", "30", "-preset", "faster",
    "-acodec", "aac", output_file
]
subprocess.run(cmd, check=True)

# Replace the old file
os.replace(output_file, input_file)
print("Compression complete. File size:", os.path.getsize(input_file) / (1024*1024), "MB")
