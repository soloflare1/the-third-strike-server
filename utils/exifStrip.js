import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * Strip EXIF metadata from image
 */
export const stripExif = async (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath);
      return false;
    }

    // Using exiftool to strip metadata
    const outputPath = filePath.replace(/\.[^.]+$/, '_stripped$&');
    await execPromise(`exiftool -all= -overwrite_original "${filePath}"`);
    
    console.log('✅ EXIF metadata stripped from:', filePath);
    return true;
  } catch (error) {
    console.error('❌ Error stripping EXIF:', error.message);
    return false;
  }
};

/**
 * Remove file from server
 */
export const removeFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ File removed:', filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error removing file:', error.message);
    return false;
  }
};