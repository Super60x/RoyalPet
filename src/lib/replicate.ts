import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// ---------------------------------------------------------------------------
// Model constants
// ---------------------------------------------------------------------------

export const MODEL_PRIMARY = "openai/gpt-image-1.5";
export const MODEL_FALLBACK = "black-forest-labs/flux-2-pro";
export const MODEL_UPSCALE = "nightmareai/real-esrgan";

// ---------------------------------------------------------------------------
// Generation — primary model (GPT Image 1.5)
// ---------------------------------------------------------------------------

export async function startGeneration(
  imageUrl: string,
  prompt: string
): Promise<{ predictionId: string; model: string }> {
  const prediction = await replicate.predictions.create({
    model: MODEL_PRIMARY,
    input: {
      prompt,
      image: imageUrl,
      size: "1024x1536",
      quality: "high",
      output_format: "png",
      input_fidelity: "high",
    },
  });

  if (!prediction.id) {
    throw new Error("Primary model prediction failed to start");
  }

  return { predictionId: prediction.id, model: MODEL_PRIMARY };
}

// ---------------------------------------------------------------------------
// Generation — fallback model (FLUX.2 Pro)
// ---------------------------------------------------------------------------

export async function startFallbackGeneration(
  imageUrl: string,
  prompt: string
): Promise<{ predictionId: string; model: string }> {
  const prediction = await replicate.predictions.create({
    model: MODEL_FALLBACK,
    input: {
      prompt,
      image: imageUrl,
      guidance: 3.5,
      strength: 0.8,
      output_format: "png",
    },
  });

  if (!prediction.id) {
    throw new Error("Fallback model prediction failed to start");
  }

  return { predictionId: prediction.id, model: MODEL_FALLBACK };
}

// ---------------------------------------------------------------------------
// Upscaling — Real-ESRGAN 2x
// ---------------------------------------------------------------------------

export async function startUpscale(imageUrl: string): Promise<string> {
  const prediction = await replicate.predictions.create({
    model: MODEL_UPSCALE,
    input: {
      image: imageUrl,
      scale: 2,
      face_enhance: false,
    },
  });

  if (!prediction.id) {
    throw new Error("Upscale prediction failed to start");
  }

  return prediction.id;
}

// ---------------------------------------------------------------------------
// Polling helpers
// ---------------------------------------------------------------------------

export async function checkGeneration(predictionId: string): Promise<{
  status: string;
  output?: string;
  error?: string;
}> {
  const prediction = await replicate.predictions.get(predictionId);

  // Handle output that may be string or string[] (varies by model)
  let output: string | undefined;
  if (prediction.output) {
    if (Array.isArray(prediction.output)) {
      output = prediction.output[0] as string;
    } else {
      output = prediction.output as string;
    }
  }

  return {
    status: prediction.status,
    output,
    error: prediction.error as string | undefined,
  };
}

/**
 * Poll a prediction until it completes or times out.
 * Used for upscaling (typically 5-15 seconds).
 */
export async function pollUntilDone(
  predictionId: string,
  timeoutMs: number = 45000
): Promise<string> {
  const start = Date.now();
  const pollInterval = 3000; // 3 seconds

  while (Date.now() - start < timeoutMs) {
    const result = await checkGeneration(predictionId);

    if (result.status === "succeeded" && result.output) {
      return result.output;
    }

    if (result.status === "failed" || result.status === "canceled") {
      throw new Error(result.error || "Prediction failed");
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error("Upscale timed out");
}
