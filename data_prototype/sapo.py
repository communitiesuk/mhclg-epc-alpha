import random 
opno = random.randint(1,5)
print(str(opno))
sapo = '"SAP-Opening-Types": {"SAP-Opening-Type": ['
i = 0
while i < opno:
    if i == 0:
        print('i=0')
        sapo = sapo + '{"Name": ".", "Description": null, "Data-Source": "2", "Type": "2", "Glazing-Type": "7",'
    else:
        print('i>0')
        sapo = sapo + ', {"Name": ".", "Description": null, "Data-Source": "2", "Type": "2", "Glazing-Type": "7",'
    if i % 2 == 0:
    	sapo = sapo +' "U-Value": "2"} '
    else:
    	sapo = sapo + '"Solar-Transmittance": "'+ str(round(random.random(), 2))+'", "Frame-Factor": "'+str(round(random.random(), 2))+'", "U-Value": "2"}'
    i += 1
sapo = sapo + ']},'
print(sapo)    	