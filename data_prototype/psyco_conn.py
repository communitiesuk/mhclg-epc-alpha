import psycopg2

connectionstring = ''

params = {
    'dbname': 'address_base',
    'user': 'Notepc-user',
    'password': 'wcwnlI8Ch',
    'host': 'epc-address3.cnkpcuwh1ksg.eu-west-2.rds.amazonaws.com',
    'port': '5432'
}

def create_table():
    command = (
        '''
        create table address (UPRN VARCHAR(15), 
            OS_ADDRESS_TO_ID VARCHAR(20), 
            UDPRN VARCHAR(15), 
            ORGANISATION_NAME VARCHAR(100), 
            DEPARTMENT_NAME VARCHAR(50), 
            PO_BOX_NUMBER VARCHAR(30), 
            SUB_BUILDING_NAME VARCHAR(30), 
            BUILDING_NAME VARCHAR(50), 
            BUILDING_NUMBER VARCHAR(20), 
            DEPENDENT_THOROUGHFARE VARCHAR(30), 
            THOROUGHFARE VARCHAR(30), 
            POST_TOWN VARCHAR(30), 
            DOUBLE_DEPENDENT_LOCALITY VARCHAR(30), 
            DEPENDENT_LOCALITY VARCHAR(30), 
            POSTCODE VARCHAR(15), 
            POSTCODE_TYPE VARCHAR(15),
            X_COORDINATE VARCHAR(20), 
            Y_COORDINATE VARCHAR(20), 
            LATITUDE VARCHAR(20), 
            LONGITUDE VARCHAR(20), 
            RPC VARCHAR(5), 
            COUNTRY VARCHAR(15), 
            CHANGE_TYPE VARCHAR(15), 
            LA_START_DATE VARCHAR(15), 
            RM_START_DATE VARCHAR(15), 
            LAST_UPDATE_DATE VARCHAR(25), 
            CLASS VARCHAR(5))
        '''
        )
    connection = psycopg2.connect(dbname = 'address_base',
                                  user = 'Notepc-user',
                                  password = 'wcwnlI8Ch',
                                  host = 'epc-address3.cnkpcuwh1ksg.eu-west-2.rds.amazonaws.com',
                                  port = '5432')
    cursor = connection.cursor()
    cursor.execute(command)
    cursor.close()
    connection.commit()
    print('connected and created table')
    if connection is not None:
        connection.close()

if __name__ == '__main__':
    create_table()
