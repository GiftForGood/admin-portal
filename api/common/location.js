import axios from 'axios';
import { GEO_LOCATION_URL } from '@constants/thirdPartyAPIUrl';

export const getLocations = async (locations) => {
  let locationDetails = [];

  const locationPromises = locations.map((location) => {
    return axios.get(`${GEO_LOCATION_URL}&address=${location} singapore`);
  });

  try {
    const results = await Promise.all(locationPromises);

    for (let i = 0; i < results.length; i++) {
      if (results[i].status != 200) {
        continue;
      }

      if (results[i].data.status !== 'OK') {
        continue;
      }

      const fullAddress = results[i].data.results[0]['formatted_address'];
      const lat = results[i].data.results[0]['geometry']['location']['lat'];
      const long = results[i].data.results[0]['geometry']['location']['lng'];

      const locationDetail = {
        name: locations[i],
        fullAddress: fullAddress,
        latitude: lat,
        longitude: long,
      };
      locationDetails.push(locationDetail);
    }
  } catch (error) {
    return null;
  }

  return locationDetails;
};
