#include <Arduino.h>
#include <TinyGPS++.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include "LoRa_E32.h"


// Device identification
const char* DEVICE_UUID =
  "550e8400-e29b-41d4-a716-446655440000";

// Worker messages
const char* MESSAGE_TYPE = "WORKER";



// GPS
TinyGPSPlus gps;

// ESP32 UART2
HardwareSerial GPS(2);

// NEO-M8N TX -> ESP32 GPIO 16
// NEO-M8N RX -> ESP32 GPIO 17
#define GPS_RX 16
#define GPS_TX 17


// LORA
HardwareSerial loraSerial(1);

// E32 TX -> ESP32 GPIO 18
// E32 RX -> ESP32 GPIO 19
#define LORA_RX 18
#define LORA_TX 19

// M0 -> GND
// M1 -> GND
// AUX -> Not connected
LoRa_E32 e32ttl(
  &loraSerial,
  -1,
  -1,
  -1
);



// MPU6050
Adafruit_MPU6050 mpu;

#define SDA_PIN 21
#define SCL_PIN 22


// TIMING
// Send data every 10 minutes
const unsigned long TRANSMISSION_INTERVAL =
  10UL * 60UL * 1000UL;

// Measure movement for 20 seconds
const unsigned long MEASUREMENT_TIME =
  20UL * 1000UL;


// ACTIVITY THRESHOLDS
const float RESTING_THRESHOLD = 0.05;

const float LOW_MOVEMENT_THRESHOLD = 0.20;


// VARIABLES
unsigned long lastTransmissionTime = 0;


// SETUP
void setup() {

  // GPS
  GPS.begin(
    9600,
    SERIAL_8N1,
    GPS_RX,
    GPS_TX
  );

  // LORA
  loraSerial.begin(
    9600,
    SERIAL_8N1,
    LORA_RX,
    LORA_TX
  );

  e32ttl.begin();

  // MPU6050
  Wire.begin(
    SDA_PIN,
    SCL_PIN
  );

  if (!mpu.begin()) {

    // Stop if MPU6050 is not available
    while (true) {
      delay(1000);
    }
  }


  // MPU6050 configuration
  mpu.setAccelerometerRange(
    MPU6050_RANGE_2_G
  );

  mpu.setGyroRange(
    MPU6050_RANGE_250_DEG
  );

  mpu.setFilterBandwidth(
    MPU6050_BAND_21_HZ
  );

  delay(1000);
}


// READ GPS DATA
void readGPS() {

  while (GPS.available()) {

    gps.encode(GPS.read());
  }
}


// MEASURE WORKER ACTIVITY
String measureActivity() {

  unsigned long startTime = millis();

  float previousMagnitude = 9.81;

  float totalMovement = 0.0;

  unsigned long samples = 0;


  while (
    millis() - startTime < MEASUREMENT_TIME
  ) {

    // Continue receiving GPS data
    readGPS();


    sensors_event_t accel;
    sensors_event_t gyro;
    sensors_event_t temp;

    mpu.getEvent(
      &accel,
      &gyro,
      &temp
    );


    // Calculate acceleration magnitude
    float magnitude = sqrt(

      accel.acceleration.x *
      accel.acceleration.x +

      accel.acceleration.y *
      accel.acceleration.y +

      accel.acceleration.z *
      accel.acceleration.z

    );


    // Calculate movement
    float movement =
      abs(magnitude - previousMagnitude);


    totalMovement += movement;

    previousMagnitude = magnitude;

    samples++;


    delay(100);
  }


  // Prevent division by zero
  if (samples == 0) {

    return "UNKNOWN";
  }


  // Calculate average movement
  float averageMovement =
    totalMovement / samples;


  // Classify activity
  if (
    averageMovement < RESTING_THRESHOLD
  ) {

    return "RESTING";
  }

  else if (
    averageMovement < LOW_MOVEMENT_THRESHOLD
  ) {

    return "LOW_MOVEMENT";
  }

  else {

    return "ACTIVE";
  }
}


// SEND WORKER DATA
void sendWorkerData(
  String activityStatus
) {

  // Process latest GPS data
  readGPS();


  String message;


  // GPS VALID
  if (gps.location.isValid()) {

    double latitude = gps.location.lat();

    double longitude = gps.location.lng();
	  
	double altitude = gps.altitude.meters();


    message =
      String(MESSAGE_TYPE) +
      "|" +
      String(DEVICE_UUID) +
      "|LAT=" +
      String(latitude, 6) +
      "|LON=" +
      String(longitude, 6) +
      "|ALT=" +
	  String(altitude, 2) +
      "|STATUS=" +
      activityStatus;
  }


  // GPS INVALID
  else {

    message =
      String(MESSAGE_TYPE) +
      "|" +
      String(DEVICE_UUID) +
      "|LAT=INVALID" +
      "|LON=INVALID" +
      "|ALT=INVALID" +
      "|STATUS=" +
      activityStatus;
  }


  // SEND THROUGH LORA
  e32ttl.sendMessage(message);
}



// MAIN LOOP
void loop() {

  // Continuously process GPS data
  readGPS();


  // Check 10-minute transmission interval
  if (
    millis() - lastTransmissionTime >=
    TRANSMISSION_INTERVAL
  ) {

    lastTransmissionTime = millis();


    // Measure activity for 20 seconds
    String activityStatus =
      measureActivity();


    // Process GPS data collected during
    // the activity measurement
    readGPS();


    // Send worker location + activity
    sendWorkerData(
      activityStatus
    );
  }
}
