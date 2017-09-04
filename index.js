'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, context) {
    console.log("Received event", JSON.stringify(event));

    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    s3.getObject({ Bucket: bucket, Key: key }, (err, data) => {
        if (err) {
            console.log(`Failure during getObject ${JSON.stringify(err)}`);
            context.fail();
        }

        const euroMillionData = JSON.parse(data.Body);

        var params = {
        };

        euroMillionData.results.forEach(r => {
            params.TableName = 'euromillion',
                params.Item = {
                    DrawNumber: r.DrawNumber,
                    Ball1: r['Ball 1'],
                    Ball2: r['Ball 2'],
                    Ball3: r['Ball 3'],
                    Ball4: r['Ball 4'],
                    Ball5: r['Ball 5'],
                    LuckyStar1: r['Lucky Star 1'],
                    LuckyStar2: r['Lucky Star 2'],
                    DrawDate: r.DrawDate
                };

            dynamo.put(params, function (err, results) {
                if (err) console.log(err);
                else {
                    context.succeed();
                }
            });
        });
    });

};