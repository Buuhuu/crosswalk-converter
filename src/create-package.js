import converterCfg from "../e2e/converter.yaml";
import mappingCfg from "../e2e/paths.yaml";
import {pipe} from "./util/pipe";
import {blobEncode, fetchContent, html2md, md2html, parseMd, stringifyMdast, transformMdast, xml2package} from "./steps";
import {toPackage} from "./wrapper/package";

function getUrl() {
  if (process.argv.length > 2) {
    return new URL(process.argv[2]);
  }
  return new URL("http://www.aem.live/developer");
}

function pipeline() {
  return pipe()
    .use(fetchContent)
    .use(html2md)
    .use(parseMd)
    .use(transformMdast)
    .use(stringifyMdast)
    .use(md2html, (_, params) => !params.md)
    .use(blobEncode)
    .use(xml2package);
}

const url = getUrl();
const { origin = 'http://www.aem.live', pathname = '/developer' } = url;
const requestPath = pathname;
const packageHandler = pipeline().wrap(toPackage, {
  converterCfg,
  mappingCfg,
  origin,
  requestPath,
});

await packageHandler();