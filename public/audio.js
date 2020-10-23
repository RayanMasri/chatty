class Voice {
    constructor() {
        this.group = [];
    }

    attach(stream) {
        const audio = new Audio();
        audio.srcObject = stream;
        audio.play();

        this.group.push(audio);
    }

    clear() {
        this.group.map((audio) => {
            audio.srcObject = null;
            audio.load();
            audio.play();
        });

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

    uuid4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

export { Voice };
