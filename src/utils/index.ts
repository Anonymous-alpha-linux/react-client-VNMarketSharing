import moment from 'moment';

export function getCookie(cname: string): string {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

export function getNestedObject(
    nestedObj: { [key: string]: any },
    pathArr: string | Array<string>
) {
    if (Array.isArray(pathArr))
        return pathArr.reduce((obj: { [key: string]: any }, path: string) => {
            return obj && !!obj[path as keyof typeof obj] ? obj[path] : null;
        }, nestedObj);

    return nestedObj[pathArr];
}

export function normalizeVietnamese(str: string): string {
    str = str.toLowerCase();
    //     We can also use this instead of from line 11 to line 17
    //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    //     str = str.replace(/\u0111/g, "d");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
}

export function getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');
    ctx && ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL('image/png');

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
}

export function transformImagetoString(
    img: File | Blob,
    callback?: (value: string) => void
): Promise<string> {
    return new Promise((resolve) => {
        const fileReader = new FileReader();

        fileReader.onloadend = function () {
            if (callback) callback(fileReader.result as string);
            resolve(fileReader.result as string);
        };

        fileReader.readAsDataURL(img);
    });
}

export function getPhoto(base64Image: string) {
    var base64 = base64Image;
    var base64Parts = base64.split(',');
    var fileFormat = base64Parts[0].split(';')[1];
    var fileContent = base64Parts[1];
    var file = new File(
        [fileContent],
        `file-${Math.floor(Math.random() * 10000000)}`,
        { type: fileFormat }
    );
    return file;
}

export function encodeURI(url: string) {
    return encodeURIComponent(url);
}

export function timeDifferenceString(
    current: Date | string,
    diff: Date | string
): string {
    const diffArray = {
        years: 'on',
        months: 'on',
        weeks: 'ago',
        days: 'ago',
        hours: 'ago',
        minutes: 'ago',
        seconds: 'ago',
    };

    return Object.entries(diffArray).reduceRight((pre, [unit, val]) => {
        const _diff = moment(diff).diff(
            current,
            unit as moment.unitOfTime.Diff
        );

        return _diff > 1 ? `${_diff} ${unit} ${val}` : pre;
    }, '');
}
