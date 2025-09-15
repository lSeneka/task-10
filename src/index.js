// index.js
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const TOPIC_ARN_NAME = process.env.TOPIC_ARN_NAME;
const REGION = process.env.REGION;

const sns = new SNSClient({ region: REGION });

exports.handler = async (event, context) => {
    if (!event || !event.Records || event.Records.length === 0) {
        return { statusCode: 200, body: JSON.stringify("No messages to process") };
    }

    let processed = 0;
    for (const r of event.Records) {
        if (!r.body) continue;
        await sns.send(new PublishCommand({
            TopicArn: TOPIC_ARN_NAME,
            Message: r.body,
            MessageAttributes: {
                source: { DataType: "String", StringValue: "dk-UploadsNotificationFunction" }
            }
        }));
        processed++;
    }

    console.log(`Processed: ${processed}; Remaining: ${context.getRemainingTimeInMillis()} ms`);
    return { statusCode: 200, body: JSON.stringify("OK") };
};