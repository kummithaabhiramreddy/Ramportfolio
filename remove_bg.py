from PIL import Image

def remove_dark_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        
        # The background is dark gray/black. The letters are bright blue/silver.
        # If the brightest color channel is very low, it's background.
        if max(r, g, b) < 40:
            newData.append((r, g, b, 0)) # Fully transparent
        else:
            # Keep the letter pixels 100% solid (no fading)
            newData.append((r, g, b, 255))

    img.putdata(newData)
    img.save(output_path, "PNG")
    print("Perfect solid background removed.")

if __name__ == "__main__":
    remove_dark_background("oas-logo.png", "oas-logo-nobg.png")
