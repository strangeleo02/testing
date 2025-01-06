import subprocess
import sys
import json
import os
import time

def separate_audio(input_file, output_dir):
    try:
        start_time = time.time()
        command = [
            "python3",
            "-m",
            "demucs",
            "--name",
            "mdx_extra",
            input_file,
            "--out",
            output_dir,
        ]
        
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        end_time = time.time()
        duration = end_time - start_time
        print(f"Time taken {duration:.2f}")
        if process.returncode != 0:
            print("stderr: ", stderr.decode())
            raise Exception(f"Demucs failed with exit code {process.returncode}")

        output_data = {}
        for filename in os.listdir(os.path.join(output_dir, os.path.splitext(os.path.basename(input_file))[0])):
            if filename.endswith((".wav")):
                 output_data[filename] = os.path.join(output_dir, os.path.splitext(os.path.basename(input_file))[0], filename)
        
        return output_data
    
    except Exception as e:
       print(f"Error: {e}")
       return None

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python demucs_wrapper.py <input_file> <output_dir>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_dir = sys.argv[2]
    
    output = separate_audio(input_file, output_dir)
    if output is not None:
        print(json.dumps(output))
    else:
       print('{}')
    sys.stdout.flush()