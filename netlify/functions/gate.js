const urlList = [
    "https://t.me/url1",
    "https://t.me/url2",
    "https://t.me/url3"
];

let hitStore = {}; // memory storage for demo, for prod use DB

exports.handler = async function(event, context) {
    const cookieHeader = event.headers.cookie || "";
    let visitorID = cookieHeader.match(/visitorID=([a-zA-Z0-9]+)/);
    visitorID = visitorID ? visitorID[1] : Math.random().toString(36).substring(2, 12);

    if (!hitStore[visitorID]) hitStore[visitorID] = { count: 0 };

    const hitCount = hitStore[visitorID].count;

    let response;
    if (hitCount < urlList.length) {
        response = {
            LockApp: true,
            Link: urlList[hitCount]
        };
    } else {
        response = {
            LockApp: false,
            Link: "false"
        };
    }

    hitStore[visitorID].count += 1;

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `visitorID=${visitorID}; Path=/; Max-Age=31536000`
        },
        body: JSON.stringify(response)
    };
};
