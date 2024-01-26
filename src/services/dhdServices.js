import http from 'utils/http';
import endpoints from 'constants/endpoints';
import { GET, POST } from 'constants/appConstant';
import { interpolate } from 'utils/string';

export const dhdCreate = async (payload) => {
  const { data } = await http(POST, endpoints.dhd.create, {
    body: payload
  });
  return data;
};

export const formatCreateDhdInput = (input) => {
  return {
    dhdDate: new Date(input.dhdDate).toLocaleDateString(),
    feeling: input.feeling,
    isFamilyUnwell: input.isFamilyUnwell,
    matchedCovid: input.matchedCovid,
    reportDate: input.reportDate,
    symptoms: input.symptoms,
    otherSymptom: input.otherSymptom,
    hasConsultedDoctor: input.hasConsultedDoctor,
    doctorName: input.doctorName,
    hospitalName: input.hospitalName,
    testAndResult: input.testAndResult,
    pctOrAntigen: input.pctOrAntigen,
    pcrTest: input.pcrTest,
    antigenTest: input.antigenTest,
    goneOutside: input.goneOutside,
    outsideLocation: input.outsideLocation,
    metCoworker: input.metCoworker,
    additionalInfo: input.additionalInfo,
    agree: input.agree
  };
};

export const dhdList = async () => {
  const { data } = await http(GET, endpoints.dhd.list);
  return data;
};

export const dhdById = async (id) => {
  const { data } = await http(GET, interpolate(endpoints.dhd.show, id));
  return data;
};
