import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { LocationService } from './location.service';
import { Location } from './location.entity';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationsService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location', description: 'Creates a new location entry in the database.' })
  @ApiBody({ description: 'Location data', type: CreateLocationDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The location has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided.' })
  create(@Body() locationData: CreateLocationDto): Promise<Location> {
    return this.locationsService.create(locationData);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all locations', description: 'Returns a list of all locations.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved list of locations.', type: [Location] })
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single location by ID', description: 'Retrieves a single location entry by its ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the location to retrieve', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully retrieved location.', type: Location })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Location not found.' })
  findOne(@Param('id') id: number): Promise<Location> {
    return this.locationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a location by ID', description: 'Updates the details of an existing location by ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the location to update', type: Number })
  @ApiBody({ description: 'Updated location data', type: UpdateLocationDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'The location has been successfully updated.', type: Location })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Location not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data provided.' })
  update(@Param('id') id: number, @Body() locationData: UpdateLocationDto): Promise<Location> {
    return this.locationsService.update(id, locationData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a location by ID', description: 'Deletes a location entry by its ID.' })
  @ApiParam({ name: 'id', description: 'The ID of the location to delete', type: Number })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The location has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Location not found.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.locationsService.remove(id);
  }
}