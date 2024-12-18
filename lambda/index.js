import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from 'stream';
import sharp from 'sharp';
import util from 'util';
import path from "path";

const s3Client = new S3Client({
    region: 'us-east-1',
});

const BUCKET_THUMBNAIL = process.env['S3_BUCKET_THUMBNAIL'];

const THUMBNAIL_WIDTH = 400;

// define the handler function
export const handler = async (event, context) => {

    // Read options from the event parameter and get the source bucket
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
  
    // Object key may have spaces or unicode non-ASCII characters
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    
    const prefix = srcKey.substring(0, srcKey.lastIndexOf('/')) + '/';

    const dstBucket = BUCKET_THUMBNAIL;

    const extName = path.extname(srcKey);
    const baseName = path.basename(srcKey, extName);
    const newBaseName = baseName + '-thumb-400'
    const dstKey = prefix + newBaseName + extName;

    // Infer the image type from the file suffix
    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }

    // Check that the image type is supported
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != 'jpg' && imageType != 'jpeg' && imageType != 'png') {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    // Get the image from the source bucket. GetObjectCommand returns a stream.
    try {
        const params = {
            Bucket: srcBucket,
            Key: srcKey
        };
        var response = await s3Client.send(new GetObjectCommand(params));
        var stream = response.Body;
        
        // Convert stream to buffer to pass to sharp resize function.
        if (stream instanceof Readable) {
            var content_buffer = Buffer.concat(await stream.toArray());
            
        } else {
            throw new Error('Unknown object stream type');
        }


    } catch (error) {
        console.log(error);
        return;
    }

  
    // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
    const width = THUMBNAIL_WIDTH;

    // Use the sharp module to resize the image and save in a buffer.
    try {    
        var output_buffer = await sharp(content_buffer).resize(width).toBuffer();

    } catch (error) {
        console.log(error);
        return;
    }

    // Upload the thumbnail image to the destination bucket
    try {
        const destparams = {
            Bucket: dstBucket,
            Key: dstKey,
            Body: output_buffer,
            ContentType: "image"
        };

        const putResult = await s3Client.send(new PutObjectCommand(destparams));

    } catch (error) {
        console.log(error);
        return;
    }

    console.log('Successfully resized ' + srcBucket + '/' + srcKey +
        ' and uploaded to ' + dstBucket + '/' + dstKey);
};