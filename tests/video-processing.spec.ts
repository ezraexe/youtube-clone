import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Video Processing Service', () => {
  const testVideoPath = path.join(__dirname, '../test-assets/sample-video.mp4');
  const serviceUrl = 'http://localhost:3000';

  test.beforeAll(async () => {
    // Ensure test directory exists
    const testAssetsDir = path.join(__dirname, '../test-assets');
    if (!fs.existsSync(testAssetsDir)) {
      fs.mkdirSync(testAssetsDir, { recursive: true });
    }
    
    // You might want to download a sample video for testing if it doesn't exist
    // This is just a placeholder - you'll need to implement this
    if (!fs.existsSync(testVideoPath)) {
      console.log('Please place a sample video at', testVideoPath);
    }
  });

  test('should process a video successfully', async ({ request }) => {
    // Create a mock Cloud Pub/Sub message
    const videoId = `test-user-${Date.now()}`;
    const fileName = `${videoId}.mp4`;
    
    // Base64 encode the message as your service expects
    const message = {
      name: fileName
    };
    const encodedMessage = Buffer.from(JSON.stringify(message)).toString('base64');
    
    // Send the request to your service
    const response = await request.post(`${serviceUrl}/process-video`, {
      data: {
        message: {
          data: encodedMessage
        }
      }
    });
    
    // Assert the response
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('Processing finished successfully');
    
    // You could add more assertions here to verify the video was processed correctly
    // For example, checking Firestore for the updated status
  });
}); 