import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon } from './icons/SparklesIcon';

const LOADING_STAGES = [
  { message: "Notre IA se prépare...", duration: 3000, progress: 10 },
  { message: "Analyse de votre demande...", duration: 5000, progress: 20 },
  { message: "Génération des premières scènes...", duration: 30000, progress: 50 },
  { message: "Compilation et montage de la vidéo...", duration: 30000, progress: 85 },
  { message: "Application des effets finaux...", duration: 20000, progress: 95 },
];

const AdGeneratorDemo: React.FC = () => {
  const [productName, setProductName] = useState('Miel de Jujubier');
  const [style, setStyle] = useState('Luxe');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [generatedMediaUrl, setGeneratedMediaUrl] = useState('https://i.imgur.com/2y3aY2R.png');
  const [generatedMediaType, setGeneratedMediaType] = useState<'image' | 'video'>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressTransitionDuration, setProgressTransitionDuration] = useState('0s');
  const [error, setError] = useState<string | null>(null);

  const isGenerationRunning = useRef(false);
  // Fix: Use ReturnType<typeof setTimeout> for environment-agnostic timeout handle type
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const styles = ['Moderne', 'Luxe', 'Traditionnel', 'Minimaliste'];
  const aspectRatiosOptions = [
    { value: '1:1', label: 'Post Carré (FB/Insta)' },
    { value: '9:16', label: 'Story (Insta/TikTok)' },
    { value: '4:3', label: 'Post Classique (FB)' },
    { value: '3:4', label: 'Post Portrait (Insta)' },
    { value: '16:9', label: 'Vidéo (YouTube/FB)' },
  ];
  
  const aspectRatioClasses: { [key: string]: string } = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
    '4:3': 'aspect-[4/3]',
    '3:4': 'aspect-[3/4]',
  };

  useEffect(() => {
    return () => {
      if (generatedMediaUrl && generatedMediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(generatedMediaUrl);
      }
      timeouts.current.forEach(clearTimeout);
    };
  }, [generatedMediaUrl]);

  const handleGenerateImage = async (ai: GoogleGenAI, prompt: string) => {
    setLoadingMessage("L'IA dessine votre pub...");
    setProgress(50);
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
      },
    });
    setProgress(100);
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
    setGeneratedMediaUrl(imageUrl);
    setGeneratedMediaType('image');
  };

  const handleGenerateVideo = async (ai: GoogleGenAI, prompt: string) => {
    const cleanup = () => {
        timeouts.current.forEach(clearTimeout);
        timeouts.current = [];
    };

    let cumulativeTime = 0;
    LOADING_STAGES.forEach(stage => {
        const timeout = setTimeout(() => {
            if (!isGenerationRunning.current) return;
            setLoadingMessage(stage.message);
            setProgress(stage.progress);
            setProgressTransitionDuration(`${stage.duration / 1000}s`);
        }, cumulativeTime);
        timeouts.current.push(timeout);
        cumulativeTime += stage.duration;
    });

    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: { numberOfVideos: 1 }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            if (!isGenerationRunning.current) throw new Error("Generation cancelled");
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        cleanup();
        setLoadingMessage('Téléchargement de la vidéo...');
        setProgressTransitionDuration('0.5s');
        setProgress(99);

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("Le lien de téléchargement de la vidéo n'a pas été trouvé.");

        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY as string}`);
        if (!videoResponse.ok) throw new Error(`Erreur lors du téléchargement : ${videoResponse.statusText}`);

        const videoBlob = await videoResponse.blob();
        const videoUrl = URL.createObjectURL(videoBlob);

        setProgress(100);
        setGeneratedMediaUrl(videoUrl);
        setGeneratedMediaType('video');
    } finally {
        cleanup();
    }
  };

  const handleGenerateClick = async () => {
    if (!productName) {
      setError("Veuillez entrer un nom de produit.");
      return;
    }
    
    isGenerationRunning.current = true;
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setProgressTransitionDuration('0s');
    setLoadingMessage("Initialisation...");

    if (generatedMediaUrl && generatedMediaUrl.startsWith('blob:')) {
      URL.revokeObjectURL(generatedMediaUrl);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Publicité vidéo courte et dynamique pour un produit e-commerce en Algérie : '${productName}'. Style : ${style}. Mettre le produit en valeur sous différents angles avec un éclairage professionnel. Ambiance engageante. Haute définition, 8k.`;

      if (mediaType === 'image') {
        await handleGenerateImage(ai, prompt);
      } else {
        await handleGenerateVideo(ai, prompt);
      }

    } catch (e) {
      console.error(e);
      setError("Désolé, une erreur est survenue. Veuillez réessayer.");
    } finally {
      isGenerationRunning.current = false;
      setIsLoading(false);
      setProgress(0);
      setLoadingMessage('');
    }
  };

  return (
    <section id="ad-creator" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Créez des Publicités Uniques avec l'IA</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Décrivez votre produit, choisissez un style, et laissez notre IA générer un visuel ou une vidéo publicitaire percutante en quelques secondes.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="mb-6">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-2">1. Entrez le nom de votre produit</label>
              <input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Tapis Berbère fait main"
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                aria-label="Nom du produit"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">2. Choisissez un style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`p-3 rounded-lg text-sm font-semibold transition-all duration-200 ${style === s ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                    aria-pressed={style === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">3. Choisissez un format</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {aspectRatiosOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAspectRatio(option.value)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${aspectRatio === option.value ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                    aria-pressed={aspectRatio === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
             <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-3">4. Choisissez le type de média</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setMediaType('image')}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${mediaType === 'image' ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                    aria-pressed={mediaType === 'image'}
                  >
                    Image
                  </button>
                  <button
                    onClick={() => setMediaType('video')}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${mediaType === 'video' ? 'bg-green-500 text-white ring-2 ring-green-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                    aria-pressed={mediaType === 'video'}
                  >
                    Vidéo
                  </button>
              </div>
            </div>
            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-8 rounded-full transition-transform transform hover:scale-105"
              aria-label="Générer le média publicitaire"
            >
              <SparklesIcon className="w-6 h-6 mr-3" />
              {isLoading ? 'Génération en cours...' : `Générer ${mediaType === 'image' ? 'le visuel' : 'la vidéo'}`}
            </button>
          </div>
          <div className={`relative mx-auto w-full max-w-xl bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl flex items-center justify-center p-2 transition-all duration-300 ${aspectRatioClasses[aspectRatio]}`}>
            {isLoading ? (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center flex-col text-center p-4">
                <SparklesIcon className="w-16 h-16 text-gray-700 animate-pulse" />
                <p className="text-gray-400 mt-4 font-semibold">{loadingMessage}</p>
                 {(mediaType === 'video' || (mediaType === 'image' && isLoading)) && (
                    <div className="w-full max-w-xs mx-auto mt-4">
                        <p className="text-gray-500 text-sm mb-2">La magie est en cours...</p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: `width ${progressTransitionDuration} linear` }}></div>
                        </div>
                         {mediaType === 'video' && <p className="text-gray-600 text-xs mt-2">La génération de vidéo peut prendre plusieurs minutes.</p>}
                    </div>
                )}
              </div>
            ) : (
                <>
                {generatedMediaType === 'image' ? (
                     <img
                        src={generatedMediaUrl}
                        alt={error ? "Erreur de génération" : `Visuel publicitaire pour ${productName} en style ${style}`}
                        className="w-full h-full object-cover rounded-xl"
                    />
                ) : (
                    <video
                        src={generatedMediaUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-xl"
                        aria-label={`Vidéo publicitaire pour ${productName} en style ${style}`}
                    />
                )}
                </>
            )}
            {!isLoading && generatedMediaType === 'video' && generatedMediaUrl && (
                <div className="absolute bottom-2 right-3 text-white/50 text-xs font-semibold pointer-events-none">
                    EcomBoost DZ
                </div>
            )}
             {error && <p className="absolute bottom-4 left-4 right-4 bg-red-500/80 text-white text-center p-3 rounded-lg text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdGeneratorDemo;