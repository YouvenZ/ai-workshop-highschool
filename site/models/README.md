# Bundled TensorFlow.js models

Served from this site so the camera activities work even where Google's model
hosting (tfhub.dev → Kaggle redirects) is slow or blocked. Both are loaded
first from here and fall back to the online copy only if this fails.

| Folder | Model | Used by | Source | License |
|---|---|---|---|---|
| `mobilenet_v2_050/` | MobileNet v2, α 0.5, 224 px, graph model (~7.6 MB) | `play/teachable.html` | Kaggle `google/mobilenet-v2/tfJs/050-224-classification/2` (the model `@tensorflow-models/mobilenet@2.1.1` loads by default) | Apache 2.0 |
| `coco-ssd-lite/` | SSDLite MobileNet v2, COCO (~18 MB) | `play/detect.html` | `storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/` (the default of `@tensorflow-models/coco-ssd@2.2.3`) | Apache 2.0 |

Do not edit these files.
