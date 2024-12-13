import os
import json
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from pptx import Presentation
import shutil
import yt_dlp
from moviepy.editor import AudioFileClip
import re
import requests

def setup_output_directory(output_dir):
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir)

def download_youtube_video_and_audio(video_url, output_dir='Saved_Media'):
    setup_output_directory(output_dir)

    # Commented as the video download is not required
    # video_options = {
    #     'format': 'best',
    #     'outtmpl': os.path.join(output_dir, 'video.%(ext)s'),
    # }

    audio_options = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(output_dir, 'audio.%(ext)s'),
    }

    # for download_options in [video_options, audio_options]:

    with yt_dlp.YoutubeDL(audio_options) as youtube_downloader:
        youtube_downloader.download([video_url])

    print("Video and audio download completed!")

def convert_audio_to_mp3(input_audio_path, output_mp3_path):
    audio = AudioFileClip(input_audio_path)
    audio.write_audiofile(output_mp3_path)
    audio.close()
    print("Audio conversion to MP3 completed!")

def process_youtube_video(video_url):
    output_dir = 'Saved_Media'
    
    download_youtube_video_and_audio(video_url, output_dir)
    
    input_audio_path = os.path.join(output_dir, 'audio.webm')
    output_mp3_path = os.path.join(output_dir, 'audio.mp3')
    
    convert_audio_to_mp3(input_audio_path, output_mp3_path)

def clean_captions(raw_captions):
    lines = raw_captions.decode('utf-8').split('\n')
    cleaned_captions = []
    timestamp_pattern = re.compile(r'\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}')
    
    for line in lines:
        if line and not line.startswith('WEBVTT') and not timestamp_pattern.match(line):
            cleaned_line = line.strip()
            if cleaned_line:
                cleaned_captions.append(cleaned_line)
    
    return ' '.join(cleaned_captions)

def extract_subtitles(video_url):
    subtitle_options = {
        'writesubtitles': True,
        'subtitleslangs': ['en'],
        'subtitlesformat': 'vtt',
        'skip_download': True,
    }

    with yt_dlp.YoutubeDL(subtitle_options) as youtube_downloader:
        info_dict = youtube_downloader.extract_info(video_url, download=False)
        subtitles = info_dict.get('requested_subtitles', None)
        
        if subtitles:
            print(f"Subtitles available for {video_url}")
            for lang, subtitle_info in subtitles.items():
                subtitle_url = subtitle_info.get('url')
                if subtitle_url:
                    response = requests.get(subtitle_url)
                    if response.status_code == 200:
                        raw_subtitles = response.content
                        return clean_captions(raw_subtitles)
 
def get_youtube_transcript(youtube_url: str) -> str:
    try:
        existing_subtitles = extract_subtitles(youtube_url)
        if existing_subtitles:
            print("Subtitles found ... Extracted Subtitles from YouTube Video...")
            return existing_subtitles
        else:
            print("Getting YouTube Video's Audio...")
            process_youtube_video(youtube_url)
            audio_file = r"Saved_Media\audio.mp3"
            if not os.path.exists(audio_file):
                raise FileNotFoundError(f"Audio file not found: {audio_file}")
            
            print("Transcribing Audio...")
            transcriber = WhisperTranscriber()
            transcribed_text = transcriber.transcribe(audio_file)
            return transcribed_text
    except Exception as e:
        print(f"Error: {e}")
        return ""


def parse_json(json_string):
    """
    Parse a JSON string into a Python object.

    Args:
        json_string (str): JSON string to parse, optionally with markdown code block markers

    Returns:
        dict/list: Parsed JSON object

    Raises:
        json.JSONDecodeError: If the JSON string is invalid
    """
    cleaned_string = json_string.replace('```json', '').replace('```', '').strip()
    
    return json.loads(cleaned_string)

