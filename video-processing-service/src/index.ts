import express from "express";
import {
  convertVideo,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo
} from "./storage";
import { isVideoNew, setVideo } from "./firestore";

// Create the local directories for videos
setupDirectories();

const app = express();
app.use(express.json());

// Add error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal Server Error');
});

app.post("/process-video", async (req, res): Promise<any> => {
  try {
    console.log('=== Starting video processing request ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Get the bucket and filename from the Cloud Pub/Sub message
    let data;
    try {
      console.log('Attempting to decode message data...');
      const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
      console.log('Decoded message:', message);
      
      data = JSON.parse(message);
      console.log('Parsed data:', data);
      
      if (!data.name) {
        console.error('No filename in message data');
        return res.status(400).send('Bad Request: missing filename.');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      return res.status(400).send(`Bad Request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;
    const videoId = inputFileName.split('.')[0];
    
    console.log('Processing details:', {
      inputFileName,
      outputFileName,
      videoId
    });

    // Check if video is new with error handling
    try {
      const isNew = await isVideoNew(videoId);
      console.log(`Video ${videoId} is new: ${isNew}`);
      
      if (!isNew) {
        return res.status(400).send('Bad Request: video already processing or processed.');
      }
      
      // Set initial video status
      await setVideo(videoId, {
        id: videoId,
        uid: videoId.split('-')[0],
        status: 'processing'
      });
      console.log('Initial video status set successfully');
    } catch (error) {
      console.error('Error in Firestore operations:', error);
      // Continue processing even if Firestore fails
    }

    // Process the video
    try {
      console.log('Downloading raw video...');
      await downloadRawVideo(inputFileName);

      console.log('Converting video...');
      await convertVideo(inputFileName, outputFileName);

      console.log('Uploading processed video...');
      await uploadProcessedVideo(outputFileName);

      // Update video status
      try {
        await setVideo(videoId, {
          status: 'processed',
          filename: outputFileName
        });
        console.log('Final video status updated successfully');
      } catch (error) {
        console.error('Error updating final video status:', error);
      }

      // Cleanup
      await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
      ]);

      return res.status(200).send('Processing finished successfully');
    } catch (error) {
      console.error('Error in video processing:', error);
      
      // Cleanup on error
      await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
      ]);
      
      return res.status(500).send(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Unhandled error in process-video endpoint:', error);
    return res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Video processing service listening at http://localhost:${port}`);
});
