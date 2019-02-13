# -*- coding: utf-8 -*-
'''
generate.py 
Script to generate dummy EPC RdSAP data for the EPC alpha datastore prototype
Structure is taken from json clickstream generator created for a coding test.  
Will build the chunks within and then put them into the record, then add the 
records to the file.   


Author: nigel@notbinary.co.uk
Created: 08/02/2019
'''

import sys
import uuid
from datetime import datetime
import json
import time
import random

def random_N(n):
    range_start = 10**(n-1)
    range_end = (10**n)-1
    return random.randint(range_start, range_end)

class Generate():

    def __init__(self):
        self.data = []
        self.batch = int(sys.argv[1])
        self.output = sys.argv[2]
        starttime=time.time()

    def create_SAPreport(self):
        # create sap report
        sapreport =  '{"SAP-Report": {"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",\
 "@xsi:schemaLocation": "http://www.epcregister.com/xsd/sap https://uat.epcregister.com/xsd/SAP/Templates/SAP-Report.xsd",\
 "@xmlns": "http://www.epcregister.com/xsd/sap", "Schema-Version-Original": "LIG-17.0", "SAP-Version": "9.92", "SAP-Data-Version": "9.81", \
 "PCDF-Revision-Number": "427", "Calculation-Software-Name": "Elmhurst Sap 2012 Desktop", "Calculation-Software-Version": "1.21r03",'
        print(sapreport)
        return sapreport

    def genRRN(self):
    	rrn = str(random_N(4))+'-'+str(random_N(4))+'-'+str(random_N(4))+'-'+str(random_N(4))
    	return rrn

    def create_ReportHeader(self):
        # create report header
        rephead1 = '"Report-Header": {"RRN": "' + self.genRRN() + '", "Inspection-Date": "2018-06-26", "Report-Type": "3", "Completion-Date": "2018-06-26", \
"Registration-Date": "2018-06-26", "Status": "entered", "Language-Code": "1", "Tenure": "ND", "Transaction-Type": ' + str(random_N(1))  
        rephead2 = ', "Seller-Commission-Report": "Y", "Property-Type": ' + str(random_N(1)) + ', '
        rephead = rephead1 + rephead2 
        return rephead

    def create_HomeInspector(self):
        # create home inspector section
        homeinsp = '"Home-Inspector": {"Name": "Autogen", "Notify-Lodgement": "Y", "Contact-Address": {"Address-Line-1": "123 Street", "Address-Line-2": "Locality", \
"Address-Line-3": "County", "Post-Town": "Town", "Postcode": "LE17 4HB"}, "Web-Site": "www.elmhurstenergy.co.uk", "E-Mail": "testteam.surveyor@elmhurstenergy.co.uk", \
"Fax": "03333 333333", "Telephone": "01788 11111", "Company-Name": "Notbinary Alpha Team", "Scheme-Name": "Elmhurst Energy Systems Ltd", "Scheme-Web-Site": "www.elmhurstenergy.co.uk", \
"Identification-Number": {"Certificate-Number": "EES/090010"}}, '
        return homeinsp

    def create_Property(self):
        # create property section
        prop = '"Property": {"Address": \
            {"Address-Line-1": "63, Whitehill Road", \
            "Address-Line-2": "Ellistown", \
            "Address-Line-3": null, \
            "Post-Town": "COALVILLE", \
            "Postcode": "LE67 1EN"}, \
            "UPRN":' + str(random_N(10)) + '}, \
            "Region-Code": "6", \
            "Country-Code": "ENG", \
            "Related-Party-Disclosure": \
            {"Related-Party-Disclosure-Number": "1"}}, '
        return prop
			
    def create_energy_assess(self):
        assess1 = '"Energy-Assessment": \
            {"Assessment-Date": "' + str(datetime.today()) + '", \
            "Property-Summary": '
        walls = '{"Walls": \
            {"Description": "Average thermal transmittance ' + str(round(random.uniform(0,5), 2)) + 'W/m\\u00b2K", \
            "Energy-Efficiency-Rating": ' + str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating":' + str(random.randint(0,5)) + '},'
        roof = '"Roof": \
            {"Description": "Average thermal transmittance: ' + str(round(random.uniform(0,5), 2)) + 'W/m\\u00b2K",\
            "Energy-Efficiency-Rating": ' +  str(random.randint(0,5)) + ',\
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '}, '
        floor = '"Floor": \
            {"Description": "(other premises below)", \
            "Energy-Efficiency-Rating": '+ str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '}, '
        windows = '"Windows": \
            {"Description": "High performance glazing", \
            "Energy-Efficiency-Rating": '+ str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '},'
        mainheating = '"Main-Heating": \
            {"Description": "Air source heat pump, radiators, electric", \
            "Energy-Efficiency-Rating": ' + str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '}, '
        mainheatingcontrol = '"Main-Heating-Controls": \
            {"Description": "Programmer and at least two room thermostats", \
            "Energy-Efficiency-Rating": ' + str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '}, '
        secondheating = '"Secondary-Heating": \
            {"Description": "Room heaters, electric", \
            "Energy-Efficiency-Rating": ' + str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '}, '
        hotwater = '"Hot-Water": \
            {"Description": "From main system", \
            "Energy-Efficiency-Rating": ' + str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '}, '
        lighting = '"Lighting": \
            {"Description": "Low energy lighting in 75% of fixed outlets", \
            "Energy-Efficiency-Rating": ' + str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '}, '
        airtightness = '"Air-Tightness": \
            {"Description": "Air permeability ' + str(round(random.uniform(0, 5), 2)) + 'Wm\\u00b3/h.m\\u00b2 (as tested)", \
            "Energy-Efficiency-Rating": ' + str(random.randint(0,5)) + ', \
            "Environmental-Efficiency-Rating": ' + str(random.randint(0,5)) + '}, '
        other = '"Has-Fixed-Air-Conditioning": "false", \
            "Has-Hot-Water-Cylinder": "true", \
            "Has-Heated-Separate-Conservatory": "false", \
            "Dwelling-Type": "Mid-floor flat", \
            "Total-Floor-Area": ' + str(random.randint(0,100)) + ', "Multiple-Glazed-Percentage": ' + str(random.randint(0,100)) + '}, \
            "Energy-Use": \
            {"Energy-Rating-Average": ' + str(random.randint(0,100)) + ', \
            "Energy-Rating-Current": ' + str(random.randint(0,100)) + ', \
            "Energy-Rating-Potential": ' + str(random.randint(0,100)) + ', \
            "Environmental-Impact-Current": ' + str(random.randint(0,100)) + ', \
            "Environmental-Impact-Potential": ' + str(random.randint(0,100)) + ', \
            "Energy-Consumption-Current": ' + str(random.randint(0,100)) + ', \
            "Energy-Consumption-Potential": ' + str(random.randint(0,100)) + ', \
            "CO2-Emissions-Current": ' + str(round(random.random(), 2)) + ', \
            "CO2-Emissions-Potential": ' + str(round(random.random(), 2)) + ', \
            "CO2-Emissions-Current-Per-Floor-Area": ' + str(round(random.random(), 2)) + ', \
            "Lighting-Cost-Current": {"@currency": "GBP", "#text": ' + str(random.randint(1, 500)) + '}, \
            "Lighting-Cost-Potential": {"@currency": "GBP", "#text": ' + str(random.randint(1, 500)) + '}, \
            "Heating-Cost-Current": {"@currency": "GBP", "#text": ' + str(random.randint(1, 500)) + '}, \
            "Heating-Cost-Potential": {"@currency": "GBP", "#text": ' + str(random.randint(1, 500)) + '}, \
            "Hot-Water-Cost-Current": {"@currency": "GBP", "#text": ' + str(random.randint(1, 500)) + '}, \
            "Hot-Water-Cost-Potential": {"@currency": "GBP", "#text": ' + str(random.randint(1, 500)) + '}}, \
            "LZC-Energy-Sources": {"LZC-Energy-Source": ' + str(random.randint(1, 10)) + '}, \
            "Renewable-Heat-Incentive": \
            {"RHI-New-Dwelling": \
            {"Space-Heating": ' + str(random.randint(1, 1000)) + ', "Water-Heating": ' + str(random.randint(1, 2500)) + '}}}, '
        assess = assess1 + walls + roof + floor + windows + mainheating + mainheatingcontrol + secondheating + hotwater + lighting + airtightness + other 
        return assess

    def create_SAPdata(self):
    	# crate buildingparts data loop
    	sapdata = '"SAP2012-Data": \
			{"Data-Type": ' + str(random.randint(1,5)) + ', "SAP-Property-Details": \
			{"Property-Type": "2", \
			"Built-Form": ' + str(random.randint(1,5)) + ', \
			"Living-Area": ' + str(round(random.uniform(0, 25), 2)) + ', \
			"Orientation": ' + str(random.randint(1, 8)) + ', \
			"Conservatory-Type": ' + str(random.randint(1, 5)) + ', \
			"SAP-Special-Features": \
			{"SAP-Special-Feature": \
			{"Description": "NIBE 205", \
			"Energy-Feature": \
			{"Energy-Saved-Or-Generated": ' + str(random.randint(1, 1000)) + ', \
			"Saved-Or-Generated-Fuel": ' + str(random.randint(1, 39)) + ', \
			"Energy-Used": "0"}}}, \
			"Is-In-Smoke-Control-Area": "unknown", \
			"SAP-Flat-Details": {"Level": ' + str(random.randint(1,5)) + '},' 
    	return sapdata

    def SAPOpenings(self):
    	sapo = '"SAP-Opening-Types": {"SAP-Opening-Type": [{"Name": ".", "Description": null, "Data-Source": "2", "Type": "2", "Glazing-Type": "7",\
"Solar-Transmittance": "'+ str(round(random.random(), 2))+'", "Frame-Factor": "'+str(round(random.random(), 2))+'", "U-Value": "2"}]},'
    	return sapo    	

    def SAPBuilding(self):
        bpart = random.randint(1,3)
        bp = '"SAP-Building-Parts": {"SAP-Building-Part":'
        i = 0
        while i < bpart:
            bp =  bp +'{"Building-Part-Number": "' + str(i + 1) + '", "Identifier": "Main Dwelling", "Construction-Year": "2013", "Overshading": "2", "SAP-Openings": {"SAP-Opening": ['
            op = random.randint(1,3)
            bp = bp + '{"Name": ".", "Type": ".", "Location": "External Wall 1", "Orientation": "0", "Width": "' + str(round(random.uniform(1,5), 2)) + '", "Height": "1"} '
            bp = bp + ']}, "SAP-Floor-Dimensions": {"SAP-Floor-Dimension": {"Storey": "1",  "Description": null, "Floor-Type": "2", "Total-Floor-Area": "' + str(round(random.uniform(1,100), 2)) + '", \
 "Storey-Height": "' + str(round(random.uniform(1,5), 2)) + '", "Heat-Loss-Area": "' + str(round(random.uniform(1,100), 2)) + '", "U-Value": "' + str(round(random.uniform(1,5), 2)) + '"}}, \
 "SAP-Roofs": {"SAP-Roof": '
            bp = bp + '[{"Name": "Roof 1", "Description": null, "Roof-Type": "2", "Total-Roof-Area": "' + str(round(random.uniform(1,100), 2)) + '", \
"U-Value": "' + str(round(random.uniform(1,20), 2)) + '"} '
            bp = bp + ']}, "SAP-Walls": {"SAP-Wall": {"Name": "External Wall 1", "Description": null, "Wall-Type": "2", "Total-Wall-Area": "' + str(round(random.uniform(1,100), 2)) + '", \
"U-Value": "' + str(round(random.uniform(1,20), 2)) + '", "Is-Curtain-Walling": "false"}}, '
            i += 1
        return bp

    def thermalbridge(self):
        tbridge = '"SAP-Thermal-Bridges": {"Thermal-Bridge-Code": "4", "User-Defined-Y-Value": "' + str(round(random.uniform(0, 5), 2)) +'", "Calculation-Reference": "2006 regulations"}, \
"Thermal-Mass-Parameter": "'+ str(round(random.uniform(0, 500), 0)) +'"}}, "SAP-Ventilation": {"Open-Fireplaces-Count": "0", "Open-Flues-Count": "0", "Extract-Fans-Count": "3", \
"PSV-Count": "0", "Flueless-Gas-Fires-Count": "0", "Pressure-Test": "1", "Air-Permeability": "' + str(round(random.uniform(0,5), 2)) + '", \
"Sheltered-Sides-Count": "2", "Ventilation-Type": "1"}, "SAP-Heating": {"Main-Heating-Details": {"Main-Heating": {"Main-Heating-Number": "1",\
"Main-Heating-Category": "4", "Main-Heating-Fraction": "1", "Main-Heating-Data-Source": "3", "Emitter-Temperature": "2", "MCS-Installed-Heat-Pump": "false", \
"Central-Heating-Pump-Age": "2", "Main-Heating-Code": "' + str(round(random.uniform(0, 300),0)) + '", "Main-Fuel-Type": "39", "Main-Heating-Control": "2205", \
"Heat-Emitter-Type": "1", "Is-Central-Heating-Pump-In-Heated-Space": "true"}}, "Secondary-Heating-Category": "10", "Secondary-Heating-Data-Source": "3", \
"Secondary-Fuel-Type": "39", "Secondary-Heating-Code": "691", "Has-Fixed-Air-Conditioning": "false", "Water-Heating-Code": "901", "Water-Fuel-Type": "39", \
"Has-Hot-Water-Cylinder": "true", "Thermal-Store": "1", "Hot-Water-Store-Size": "' + str(round(random.uniform(0, 300),0)) + '", "Hot-Water-Store-Heat-Loss-Source": "2", \
"Hot-Water-Store-Heat-Loss": "1.68", "Primary-Pipework-Insulation": "4", "Has-Cylinder-Thermostat": "true", "Is-Cylinder-In-Heated-Space": "true", \
"Is-Hot-Water-Separately-Timed": "true"}, "SAP-Energy-Source": {"Wind-Turbines-Count": "0", "Wind-Turbine-Terrain-Type": "1", "Fixed-Lighting-Outlets-Count": "8", \
"Low-Energy-Fixed-Lighting-Outlets-Count": "6", "Low-Energy-Fixed-Lighting-Outlets-Percentage": "75", "Electricity-Tariff": "2"}}}, \
"PDF": null, "Insurance-Details": {"Insurer": "Lloyds of London", "Policy-No": "xxxxxxxxxxx", "Effective-Date": "2015-07-01", "Expiry-Date": "2016-06-30", "PI-Limit": "5000000"}, \
"ExternalDefinitions-Revision-Number": "4.6"}}'
        return tbridge
        

    def create_data(self):
        i = 0
        saprep = self.create_SAPreport()
        rephead = self.create_ReportHeader()
        homeinsp = self.create_HomeInspector()
        prop = self.create_Property()
        assess = self.create_energy_assess()
        sapdata = self.create_SAPdata()
        sapo = self.SAPOpenings()
        sapb = self.SAPBuilding()
        thermb = self.thermalbridge()
        SAP = saprep + rephead + homeinsp + prop + assess + sapdata + sapo + sapb + thermb
        self.data = SAP
        print(self.data)
        out = open(self.output+'data.txt', 'w')
        out.write(self.data)

  
    def checknsave(self):
        print("Check size of data and save... ")

if __name__ == "__main__":
	gen_data	 = Generate()
	gen_data.create_data()