class Voice {
    constructor() {
        this.group = [];
    }

    attach(stream) {
        // preload="auto"
        var audio = $('<audio autoplay />').appendTo('body')[0];
        audio.srcObject = stream;
        this.group.push(audio);
    }

    clear() {
        this.group.map((audio) => (audio.srcObject = null));
        this.group = [];
    }

    stream(callback) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                callback(stream);
            })
            .catch((error) => {
                console.error(`Failed to connect to user media: '${error}'`);
                callback(null);
            });
    }

    devices(callback) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const info = {
                input: {
                    devices: devices
                        .filter((e) => e.kind == 'audioinput')
                        .map((e) => {
                            return {
                                label: e.label,
                                id: e.deviceId,
                            };
                        }),
                },
                output: {
                    devices: devices
                        .filter((e) => e.kind == 'audiooutput')
                        .map((e) => {
                            return {
                                label: e.label,
                                id: e.deviceId,
                            };
                        }),
                },
            };

            callback(info);
        });
    }
}

export { Voice };
