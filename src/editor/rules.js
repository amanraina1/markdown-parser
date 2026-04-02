const newline = /^(?:[ \t]*(?:\n|$))+/;
const heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;

const blockNormal = {
    newline,
    heading
};

export const block = {
    normal: blockNormal
};