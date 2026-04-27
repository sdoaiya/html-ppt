# Image Provider Configuration

The image provider is OpenAI-compatible and configured locally.

## Default Provider

- Base URL: `https://free.codesonline.dev/v1`
- Model: `gpt-image-2`
- Response format: `url`

The Base URL and API Key are user-configurable from the settings UI and stored by Electron Store.

## Endpoints

- Text to image: `POST /images/generations`
- Image edit: `POST /images/edits`

## Size and Upscale

The `size` field must be passed explicitly, such as `16:9`, `2048x1152`, or `1024x1024`.

The optional `upscale` field accepts `2k` or `4k`. It is a local enlargement step, not a second AI redraw.
